import React from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import FetchData from "@/customHooks/fetchData";

const BlogDetails = () => {
  const router = useRouter();
  const { slug } = router.query;
  const isReady = router.isReady;
  const strapiBaseURL = "http://localhost:1337";
  const { data, error, loading } = FetchData(
    isReady ? `${strapiBaseURL}/api/blogs?filters[slug][$eq]=${slug}&populate=*` : null
  );
  if (!isReady || loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  const blog = data[0];


  if (!blog) return <Typography>Blog not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={`${strapiBaseURL}${blog.BlogImage.url}`}
          alt={blog.Title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {blog.Title}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {blog.Description}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BlogDetails;
