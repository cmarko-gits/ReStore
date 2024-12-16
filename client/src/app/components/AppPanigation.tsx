import { Box, Pagination, Typography } from "@mui/material";
import { MetaData } from "../model/pagination";

interface Props {
    metaData: MetaData | null;
    onPageChange: (page: number) => void;
}

export default function AppPanigration({ metaData, onPageChange }: Props) {
    if (!metaData) {
        return null; // Or show a fallback UI, if needed
    }

    const { currentPage, totalPages, totalCount, pageSize } = metaData;
    
    return (
       
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                <Typography variant="body2">
                    Displaying {(currentPage - 1) * pageSize + 1} - {currentPage * pageSize > totalCount ? totalCount : currentPage * pageSize} of {totalCount} items
                </Typography>
            <Pagination
                color="secondary"
                size="large"
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => onPageChange(page)}
            />
            </Box>
       
    );
}
