import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Box,
} from "@mui/material";
import FetchData from "@/customHooks/fetchData";
import Link from "next/link";

const Blog = () => {
  const { data, error, loading } = FetchData(
    "http://localhost:1337/api/blogs?populate=*"
  );
  console.log(data)
  const blogs = data || [];
  const strapiBaseURL = "http://localhost:1337";

  return (
    <>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}
      <Container  className="page-container">
        <Box sx={{ marginTop: 4, marginBottom: 4 }}>
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={blog.id} >
                <Link href={`/blogDetails/${blog.slug}`} passHref>
                  <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`${strapiBaseURL}${blog.BlogImage.url}`}
                    alt={blog.Title}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      noWrap
                    >
                      {blog.Title}, {blog.documentId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {blog.Description}
                    </Typography>
                  </CardContent>
                </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Blog;
