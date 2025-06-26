import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollections from "../components/Products/GenderCollections";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollections from "../components/Products/FeaturedCollections";
import FeaturesSection from "../components/Products/FeaturesSection";

const placeholderProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=5",
        altText: "Stylish Jacket 1",
      },
    ],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=6",
        altText: "Stylish Jacket 1",
      },
    ],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 300,
    images: [
      {
        url: "https://picsum.photos/500/500?random=10",
        altText: "Stylish Jacket 8",
      },
    ],
  },
  {
    _id: 4,
    name: "Product 4",
    price: 400,
    images: [
      {
        url: "https://picsum.photos/500/500?random=10",
        altText: "Stylish Jacket 4",
      },
    ],
  },

  {
    _id: 5,
    name: "Product 1",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=55",
        altText: "Stylish Jacket 1",
      },
    ],
  },
  {
    _id: 6,
    name: "Product 2",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=50",
        altText: "Stylish Jacket 1",
      },
    ],
  },
  {
    _id: 7,
    name: "Product 3",
    price: 300,
    images: [
      {
        url: "https://picsum.photos/500/500?random=210",
        altText: "Stylish Jacket 8",
      },
    ],
  },
  {
    _id: 8,
    name: "Product 4",
    price: 400,
    images: [
      {
        url: "https://picsum.photos/500/500?random=100",
        altText: "Stylish Jacket 4",
      },
    ],
  },
];

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollections />
      <NewArrivals />

      {/*Best Seller */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      <ProductDetails />

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={placeholderProducts} />
      </div>

      <FeaturedCollections />
      <FeaturesSection />
    </div>
  );
};

export default Home;
