import React, { useState, useEffect } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";
import BlockContent from "@sanity/block-content-to-react";
import ProductCard from "./blocks/productCard";

import imageUrlBuilder from "@sanity/image-url";
import { motion } from "framer-motion";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

export default function SinglePost() {
  const [singlePost, setSinglePost] = useState();
  const [relatedPost, setRelatedPost] = useState();
  const { slug } = useParams();

  useEffect(() => {
    sanityClient
      .fetch(
        `*[slug.current == "${slug}"]{
            title,
            _id,
            slug,
            mainImage{asset->{_id,url}, hotspot, alt},
            imagesGallery, 
            tags,
            body
        }`
      )
      .then((data) => {
        setSinglePost(data[0]);

        sanityClient
          .fetch(
            `*[_type == "project"]{title,slug,mainImage{asset->{_id,url}, hotspot, alt}, tags}`
          )
          .then((relatedData) => {
            const relatedProjects = [];
            for (let index = 0; index < relatedData.length; index++) {
              const post = relatedData[index];
              if (post.tags.some((r) => data[0].tags.includes(r))) {
                if (post.title !== data[0].title) {
                  relatedProjects.push(post);
                  console.log("shares tags", post);
                }
              }
            }
            setRelatedPost(relatedProjects);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [slug]);

  if (!singlePost) return <div>Loading...</div>;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <article>
        {singlePost.mainImage.hotspot ? (
          <img
            src={urlFor(singlePost.mainImage.asset.url)}
            alt={singlePost.mainImage.alt}
            style={{
              objectPosition: `${singlePost.mainImage.hotspot.x * 100}% ${
                singlePost.mainImage.hotspot.y * 100
              }%`,
              width: "100%",
            }}
          />
        ) : (
          <img
            src={urlFor(singlePost.mainImage.asset.url)}
            alt={singlePost.mainImage.alt}
            style={{ width: "100%" }}
          />
        )}
        <motion.h1 className="headline flex-column">
          {singlePost.title}
        </motion.h1>

        {singlePost.body && (
          <div className="blockContent">
            <BlockContent
              blocks={singlePost.body}
              projectId="swdt1dj3"
              dataset="production"
            />
          </div>
        )}
      </article>

      <div className="horizontalScroll">
        {relatedPost &&
          relatedPost.map((post, index) => (
            <ProductCard post={post} key={index} />
          ))}
      </div>
    </motion.div>
  );
}
