export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 0,
    }).format(price);
};