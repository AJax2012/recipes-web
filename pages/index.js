import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useRecipeContext } from "../store/recipeState";
import { getClient } from "../lib/sanity.server";
import { groq } from "next-sanity";
import styles from "../styles/Home.module.css";
import { Container, Button } from "react-bootstrap";
import { BsChevronBarDown } from "react-icons/bs";
import { PropTypes } from "prop-types";

export default function Home({ data }) {
  const { handleSetRecipes } = useRecipeContext();

  useEffect(() => {
    handleSetRecipes(data);
  }, [handleSetRecipes]);

  const scrollToBottom = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Recipes</title>
          <meta name="description" content="View our recipes" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.splash}>
            <Image
              layout="fill"
              className={styles.image}
              src="/Cooking-Home-Collection.jpg"
              alt="recipes landing page image"
            />
            <h1 className={styles.title}>Welcome to our recipes website!</h1>
            <div className={styles.splashArrow}>
              <Button
                variant="outline-light"
                size="lg"
                onClick={scrollToBottom}
              >
                <BsChevronBarDown />
              </Button>
            </div>
          </div>
          <Container id="footer" className={`my-3 ${styles.description}`}>
            To view our recipes, please open the side nav by clicking on the
            menu button in the top left corner.
          </Container>
        </main>
      </div>
    </>
  );
}

Home.propTypes = {
  data: PropTypes.array.isRequired,
};

Home.auth = true;

export async function getStaticProps() {
  const data = await getClient(true).fetch(
    groq`*[_type == "recipe" && defined(slug.current)][] {
      title,
      image,
      cookTime,
      prepTime,
      'slug': slug.current,
    }`
  );

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
    },
  };
}
