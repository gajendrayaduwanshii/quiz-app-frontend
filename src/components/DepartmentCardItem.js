import { Grid, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DepartmentCardItem = ({ title, description, image, departmentName }) => {
    const baseUrl = "http://localhost:1337";
    const router = useRouter();
    
    return (
        <Grid item size={{xs:12, md:6, lg:3}}>
            <Card
                sx={{
                    textAlign: "left",
                    boxShadow: 3,
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.01)",
                        boxShadow: 6,
                    },
                }}
                 onClick ={() => router.push(`/quiz/${departmentName.toLowerCase()}`)}
                >
                <Image
                    src={`${baseUrl}${image}`}
                    alt={title}
                    layout="responsive"
                    width={16}
                    height={9}
                    style={{ borderBottom: "1px solid #eee", objectFit: "cover" }}
                    unoptimized 
                />
                <CardContent>
                    <Typography
                        variant="h6"
                        gutterBottom
                        title={title}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant="body2"
                        className="two-line-text-truncate"
                        color="textSecondary"
                        title={description}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default DepartmentCardItem;
