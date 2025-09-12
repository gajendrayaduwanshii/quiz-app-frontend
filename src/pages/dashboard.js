import { Grid, Typography, Box, Button } from "@mui/material";
import DepartmentCardItem from "../components/DepartmentCardItem";
import Head from "next/head";
import FetchData from "@/customHooks/fetchData";
import Loader from "@/components/Loader";

const Dashboard = () => {
  const { data, error, loading, refetch } = FetchData(
    "http://localhost:1337/api/departments?populate[departmentImage][populate]=*&populate[technologies][populate][image][populate]=*&populate[technologies][populate][questions][populate]=*"
  );

  const handleRetry = () => {
    if (refetch) {
      refetch(); 
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box className="page-container">
        <Typography
          variant="h5"
          gutterBottom
          textAlign="left"
          sx={{ mb: 2, fontWeight: "700" }}
        >
          All Departments
        </Typography>

        {loading && <Loader />}

        {error && (
          <Box sx={{ mb: 2, p: 2, border: "1px solid red", borderRadius: 1 }}>
            <Typography color="error" variant="body1" gutterBottom>
              Oops! Something went wrong while fetching the data.
            </Typography>
            <Typography color="error" variant="body2" sx={{ mb: 1 }}>
              {error.message || "Unknown error occurred."}
            </Typography>
            <Button variant="outlined" color="error" onClick={handleRetry}>
              Retry
            </Button>
          </Box>
        )}

        {!loading && !error && data && data.length > 0 ? (
          <Grid container spacing={2} className="main-container">
            {data.map((item, index) => (
              <DepartmentCardItem
                key={index}
                title={item.title}
                description={item.description}
                image={item.departmentImage?.url || ""}
                departmentName={item.name}
              />
            ))}
          </Grid>
        ) : (
          !loading &&
          !error && (
            <Typography>No departments available at the moment.</Typography>
          )
        )}
      </Box>
    </>
  );
};

export default Dashboard;
