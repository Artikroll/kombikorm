const launchPromotions = (() => {
  const timeZone = "Asia/Yekaterinburg";
  const opening = "2027-03-01";
  const preorderStart = "2027-02-01";
  const launchEnd = "2027-06-01";
  const loyaltyRate = 3;
  const introductionRate = 5;

  function phase(now = new Date()) {
    const date = new Intl.DateTimeFormat("sv-SE", { timeZone }).format(now);
    if (date >= opening && date < launchEnd) return "launch";
    if (date >= preorderStart && date < opening) return "preorder";
    return date < preorderStart ? "upcoming" : "regular";
  }

  function estimate(lines, offer, period) {
    const bags = lines.reduce((total, line) => total + line.bags, 0);
    const kg = bags * 25;
    const subtotal = lines.reduce((total, line) => total + line.amount, 0);
    const launch = period === "launch";
    const firstOrder = launch && offer === "first" && bags > 0;
    const giftBags = launch && offer === "gift"
      ? lines.reduce((total, line) => total + Math.floor(line.bags / 10), 0)
      : 0;

    // The first-order discount covers at most 3 t. Mixed baskets use their average price.
    const discount = firstOrder ? Math.round(subtotal * Math.min(1, 3000 / kg) * introductionRate) / 100 : 0;
    return {
      bags, kg, subtotal, discount, giftBags, total: subtotal - discount,
      deliveryCandidate: launch && kg >= 500,
      wholesaleCandidate: launch && kg >= 5000 && kg <= 20000,
      foundersCandidate: launch && kg >= 1000,
    };
  }

  return { phase, estimate, loyaltyRate, introductionRate };
})();

