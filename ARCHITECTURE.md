
# Guide de déploiement Aura Microlocs - Sécurité & Paiement

## 1. Sécurité Avancée (Triggers PostgreSQL)
Ne faites jamais confiance au client pour le `user_id`. Utilisez ce script dans votre SQL Editor Supabase pour forcer l'identité de l'utilisateur connecté sur chaque réservation.

```sql
-- Trigger pour forcer le user_id de l'utilisateur authentifié
CREATE OR REPLACE FUNCTION public.handle_booking_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- auth.uid() renvoie l'ID de l'utilisateur connecté via Supabase Auth
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_insert
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_booking_user_id();
```

## 2. Flux Stripe Production (Edge Functions)
Pour transformer le site en une véritable machine à réserver, suivez ces étapes :

### A. Création de la fonction de Checkout
Déployez une Edge Function nommée `create-checkout` via la CLI Supabase :
```bash
supabase functions new create-checkout
```
**Logique recommandée (Deno) :**
1. Validez le `bookingId` reçu.
2. Récupérez le prix réel du service depuis une table `services` (ne pas utiliser le prix envoyé par le client).
3. Créez une session Stripe avec `stripe.checkout.sessions.create`.
4. Renvoyez l'URL de paiement.

### B. Configuration des Webhooks (Crucial)
Configurez un Webhook Stripe qui pointe vers une autre fonction `handle-stripe-webhook`.
Quand Stripe envoie `checkout.session.completed` :
1. Récupérez le `bookingId` dans les metadata.
2. Mettez à jour le statut dans la table `bookings` : `status = 'confirmé'`.

## 3. Validation Côté Serveur
**Règle d'or :** Le frontend ne définit jamais le prix. 
Dans votre Edge Function `create-checkout` :
```typescript
// Exemple pseudo-code
const { serviceId } = await req.json();
const { data: service } = await supabaseAdmin.from('services').select('price').eq('id', serviceId).single();
const amount = service.price * 0.10 * 100; // Stripe utilise les centimes
```

## 4. Dépannage Error 23514
Si vous recevez l'erreur `violates check constraint "bookings_status_check"`, cela signifie que vous essayez d'insérer un statut qui n'est pas dans la liste `('attente_paiement', 'confirmé', 'annulé')`. Assurez-vous que votre code frontend utilise exactement ces chaînes de caractères.
