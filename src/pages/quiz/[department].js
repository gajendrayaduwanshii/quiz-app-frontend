"use client";

import { Grid, Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import Head from "next/head";
import FetchData from "@/customHooks/fetchData";
import { useRouter } from "next/router";

const Department = () => {
  const { data } = FetchData(
    "http://localhost:1337/api/departments?populate[departmentImage][populate]=*&populate[technologies][populate][image][populate]=*&populate[technologies][populate][questions][populate]=*"
  );
  const router = useRouter();
  const { department } = router.query;

  const departmentData = Array.isArray(data)
    ? data.find(dep => dep.name && dep.name.toLowerCase() === String(department).toLowerCase())
    : null;

  const technologies = departmentData?.technologies || [];

  const baseUrl = "http://localhost:1337";
  return (
    <>
      <Head>
        <title>
          {department
            ? department.charAt(0).toUpperCase() + department.slice(1)
            : "Department"} Technologies
        </title>
      </Head>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 700, textTransform: "capitalize" }}>
          {department} Technologies
        </Typography>
        {departmentData ? (
          <>
            <Grid container spacing={2}>
              {technologies.map((tech) => (
                <Grid item size={{xs:12, sm:6, md:4, lg:3}}  key={tech.id}>
                  <Card   sx={{
                    textAlign: "left",
                    cursor: "pointer",
                    boxShadow: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.01)",
                      boxShadow: 6,
                    },
                  }}
                  
                    onClick={() => router.push(`/quiz/${department}/${tech.technologyName.toLowerCase()}`)}
                >
                    <CardMedia
                      component="img"
                      image={
                        tech.image && Array.isArray(tech.image) && tech.image[0]?.url
                          ? `${baseUrl}${tech.image[0].url}`
                          : ""
                      }
                      alt={tech.technologyName}
                      sx={{ aspectRatio: "16/9", objectFit: "cover", backgroundColor: "#f9f9f9" }}
                       
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        noWrap
                        title={tech.technologyName}
                      >
                        {tech.technologyName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                        noWrap
                        title={tech.description}
                      >
                        {tech.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Typography variant="h6" gutterBottom sx={{ fontSize: "14px", mb: 2, fontWeight: 400, textTransform: "capitalize" }}>
            No Department Found.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Department;
