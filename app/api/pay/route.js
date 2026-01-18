import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await req.json();

  // Connection token
  if (!body.amount) {
    try {
      const token = await stripe.terminal.connectionTokens.create({
        location: process.env.STRIPE_TERMINAL_LOCATION,
      });

      return new Response(JSON.stringify({ secret: token.secret }), {
        status: 200,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
      });
    }
  }

  // PaymentIntent
  try {
    const amount = Number(body.amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "nok",
      payment_method_types: ["card_present"],
      capture_method: "automatic",
    });

    return new Response(JSON.stringify({ paymentIntent }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}
