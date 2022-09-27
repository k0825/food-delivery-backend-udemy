"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const stripe = require("stripe")(
  "sk_test_51Llur7DxtpbdDqXoQVEBA1gSdsXg9aVwR8zSEwhelZPs6f7VpnD6m2YiihZWsulpoVsr4lJtimxthMQ7QCxPAGwl00ZSQJ10h1"
);

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { address, amount, dishes, token } = JSON.parse(ctx.request.body);

    const charge = await stripe.charges.create({
      amount: amount,
      currency: "jpy",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user_id}`,
    });

    const order = await strapi.service("api::order.order").create({
      data: {
        publishedAt: new Date(),
        user: ctx.state.user_id,
        charge_id: charge.id,
        amount: amount,
        address,
        dishes,
      },
    });
    return order;
  },
}));
