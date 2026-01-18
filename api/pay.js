import Stripe from "stripe";

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Pokud frontend chce connection token
  if (req.method === "POST" && !req.body?.amount) {
    try {
      const token = await stripe.terminal.connectionTokens.create({
        location: process.env.STRIPE_TERMINAL_LOCATION,
      });

      return res.status(200).json({ secret: token.secret });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // Pokud frontend posílá částku → vytvoříme PaymentIntent
  if (req.method === "POST" && req.body?.amount) {
    try {
      const amount = Number(req.body.amount);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "nok",
        payment_method_types: ["card_present"],
        capture_method: "automatic",
      });

      return res.status(200).json({ paymentIntent });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
