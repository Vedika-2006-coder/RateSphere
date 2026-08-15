import {
  countRatings,
  globalRatingDistribution,
  listStoreRatings,
  listUserRatings,
  ratingDistributionForStores,
  recentRatingsForStores,
  userRatingSummary,
} from "../repositories/ratingRepository.js";
import { countStores, findStoresByOwner, listStores } from "../repositories/storeRepository.js";
import { countUsers } from "../repositories/userRepository.js";

const emptyDistribution = () => [1, 2, 3, 4, 5].map((rating) => ({ rating, count: 0 }));

function normaliseDistribution(rows) {
  const base = emptyDistribution();
  for (const row of rows) {
    const entry = base.find((item) => item.rating === Number(row.rating));
    if (entry) entry.count = Number(row.count);
  }
  return base;
}

export async function getUserDashboard(user) {
  const [storeCount, summary, ratings] = await Promise.all([
    countStores(),
    userRatingSummary(user.id),
    listUserRatings(user.id),
  ]);

  return {
    user: { name: user.name, email: user.email },
    stats: {
      totalStores: Number(storeCount?.total ?? 0),
      storesRated: Number(summary?.rated_count ?? 0),
      averageGiven: summary?.average_given === null ? null : Number(summary?.average_given),
      unratedStores: Math.max(0, Number(storeCount?.total ?? 0) - Number(summary?.rated_count ?? 0)),
    },
    recentRatings: ratings.slice(0, 5),
    distribution: normaliseDistribution(
      ratings.reduce((acc, item) => {
        const found = acc.find((entry) => entry.rating === item.rating);
        if (found) found.count += 1;
        else acc.push({ rating: item.rating, count: 1 });
        return acc;
      }, []),
    ),
  };
}

export async function getOwnerDashboard(owner) {
  const stores = await findStoresByOwner(owner.id);
  const storeIds = stores.map((store) => store.id);

  const [distribution, recent] = await Promise.all([
    ratingDistributionForStores(storeIds),
    recentRatingsForStores(storeIds),
  ]);

  const raters = storeIds.length
    ? (await Promise.all(storeIds.map((id) => listStoreRatings(id)))).flat()
    : [];

  const totalRatings = raters.length;
  const averageRating = totalRatings
    ? Number((raters.reduce((sum, item) => sum + item.rating, 0) / totalRatings).toFixed(2))
    : null;

  return {
    owner: { name: owner.name, email: owner.email },
    stores,
    stats: { totalStores: stores.length, totalRatings, averageRating },
    distribution: normaliseDistribution(distribution),
    recentRatings: recent,
    raters,
  };
}

export async function getAdminDashboard() {
  const [users, stores, ratings, distribution, topStores] = await Promise.all([
    countUsers(),
    countStores(),
    countRatings(),
    globalRatingDistribution(),
    listStores({ sortBy: "rating", order: "desc", limit: 5 }),
  ]);

  return {
    stats: {
      totalUsers: Number(users?.total ?? 0),
      totalStores: Number(stores?.total ?? 0),
      totalRatings: Number(ratings?.total ?? 0),
    },
    distribution: normaliseDistribution(distribution),
    topStores: topStores.data.filter((store) => store.total_ratings > 0),
  };
}
