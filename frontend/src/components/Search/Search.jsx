import styles from "./Search.module.scss";
import { Box } from "@mui/material";
const Search = () => {
  return (
    <Box>
      <input className={styles.input} type="text" placeholder="Search here" />
    </Box>
  );
};
export default Search;
