const launchPromotions = (() => {
  const timeZone = "Asia/Yekaterinburg";
  const opening = "2027-03-01";
  const preorderStart = "2027-02-01";
  const launchEnd = "2027-06-01";
  const foundersEnd = "2027-03-16";
  const yearEnd = "2028-01-01";

  function schedule(now = new Date()) {
    const date = new Intl.DateTimeFormat("sv-SE", { timeZone }).format(now);
    return {
      preorder: date >= preorderStart && date < opening,
      launch: date >= opening && date < launchEnd,
      founders: date >= opening && date < foundersEnd,
      pickup: date >= opening && date < yearEnd,
    };
  }

  function estimate(lines, pickup, dates) {
    const bags = lines.reduce((total, line) => total + line.bags, 0);
    const kg = bags * 25;
    const subtotal = lines.reduce((total, line) => total + line.amount, 0);
    const bulkPreorder = dates.preorder && kg >= 5000;
    const pickupDiscount = dates.pickup && pickup;
    const discount = (dates.launch || bulkPreorder || pickupDiscount) ? Math.round(subtotal * 5) / 100 : 0;
    return {
      kg, subtotal, discount, bulkPreorder, pickupDiscount, total: subtotal - discount,
      deliveryCandidate: dates.launch && kg >= 500,
      wholesaleCandidate: dates.launch && kg >= 5000 && kg <= 20000,
      foundersCandidate: dates.founders && kg >= 1000,
    };
  }

  return { schedule, estimate };
})();

