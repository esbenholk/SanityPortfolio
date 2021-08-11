import React from "react";
import sanityClient from "../../client";

import { Link } from "react-router-dom";

import imageUrlBuilder from "@sanity/image-url";

import BlockContent from "@sanity/block-content-to-react";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

export default function ProductCard({ post }) {
  var color;
  if (post.color) {
    color = "#" + post.color;
  } else {
    color = "#FFFFFF";
  }

  return (
    <div className="product_card">
      <Link
        to={"/projects/" + post.slug.current}
        key={post.slug.current + "productCard"}
        className="w-full teaser-link"
      >
        {post.productImage ? (
          <>
            {post.productImage.hotspot ? (
              <img
                src={urlFor(post.productImage.asset.url)}
                alt={post.mainImage.alt}
                style={{
                  objectPosition: `${post.productImage.hotspot.x * 100}% ${
                    post.mainImage.hotspot.y * 100
                  }%`,
                }}
                className="product_card_image"
              />
            ) : (
              <img
                src={urlFor(post.productImage.asset.url)}
                alt={post.productImage.alt}
                className="featured_post_card_image"
              />
            )}
          </>
        ) : (
          <>
            {post.mainImage.hotspot ? (
              <img
                src={urlFor(post.mainImage.asset.url)}
                alt={post.mainImage.alt}
                style={{
                  objectPosition: `${post.mainImage.hotspot.x * 100}% ${
                    post.mainImage.hotspot.y * 100
                  }%`,
                }}
                className="product_card_image"
              />
            ) : (
              <img
                src={urlFor(post.mainImage.asset.url)}
                alt={post.mainImage.alt}
                className="product_card_image"
              />
            )}
          </>
        )}

        <div className="details" style={{ color: color }}>
          <h3>{post.title}</h3>

          <div className="flex-row">
            {post.tags &&
              post.tags.map((tag, index) => (
                <p className="tag" key={index}>
                  {tag}
                  {index + 1 !== post.tags.length ? "," : null}
                </p>
              ))}
          </div>

          {post.recap && (
            <div className="recap">
              <BlockContent
                blocks={post.recap}
                projectId="swdt1dj3"
                dataset="production"
              />
            </div>
          )}

          <div className="flex-row post_category_list">
            {post.categories &&
              post.categories.map((category, index) => (
                <p className="standard-button" key={index}>
                  {" "}
                  {category.title}{" "}
                </p>
              ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
