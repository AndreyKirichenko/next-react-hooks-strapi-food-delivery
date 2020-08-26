"use strict";

/**
 * Order.js controller
 *
 * @description: A set of functions called "actions" for managing `Order`.
 */

const KEY = 'pk_test_51HKGCGIoGa6MR0kz954GwsYButA2bUvT2F6a4NAX6126GJnoqm7tPmArZM1hcvF0zFafIX89j3ZfMFlATOVZzEhb00uO8nqG93';

const stripe = require("stripe")(KEY);

module.exports = {
  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const { address, amount, dishes, token, city, state } = JSON.parse(
      ctx.request.body
    );
    const stripeAmount = Math.floor(amount * 100);
    // charge on stripe
    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: "usd",
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token,
    });

    // Register the order in the database
    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state,
    });

    return order;
  },
};
