import {  Grid, Paper, Typography } from "@mui/material";
import LoadingComponent from "../../layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors, setPageNumber, setProductParamas } from "./catalogSlice";
import ProductList from "./ProductList";
import { useEffect } from "react";
import ProductSearch from "./ProductSearch";
import RadioButtonGroups from "../../components/RadioButtonGrouprs";
import CheckboxButtons from "../../components/Checkbuttons";
import AppPanigration from "../../components/AppPanigation";

export default function Catalog() {
    const products = useAppSelector(productSelectors.selectAll);
    const { productsLoaded, filtersLoaded, types, brands, productParams } = useAppSelector((state) => state.catalog);
    const dispatch = useAppDispatch();
    const { metaData } = useAppSelector((state) => state.catalog);
    
    console.log("MetaData from Redux state:", metaData);
    const SortOptions = [
        { value: "name", label: "Alphabetical" },
        { value: "priceDesc", label: "Price - High to Low" },
        { value: "price", label: "Price - Low to High" },
    ];

    useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
    }, [productsLoaded, dispatch]);

    useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFilters());
    }, [dispatch, filtersLoaded]);

    if (!filtersLoaded) return <LoadingComponent message="Loading products..." />;



    return (
        <Grid container spacing={4} sx={{ mt: 4 }}>
            {/* Left Sidebar */}
            <Grid item xs={12} sm={4} md={3}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <ProductSearch/>
                </Paper>
                <Paper sx={{mb:2 , p:2}}>
                    <RadioButtonGroups 

                        options={SortOptions}
                        selectedValue={productParams.orderBy}
                        onChange={(e)=> dispatch(setProductParamas({orderBy : e.target.value}))}

                    />

                </Paper>
               
                            <Paper sx={{ mb: 2, p: 2 }}>
                <CheckboxButtons
                    items={brands}
                    checked={productParams.brands || []} // Prosleđuje trenutne vrednosti filtera za brendove
                    onChange={(items: string[]) => dispatch(setProductParamas({ brands: items }))}
                />
            </Paper>

            <Paper sx={{ mb: 2, p: 2 }}>
                <CheckboxButtons
                    items={types}
                    checked={productParams.types || []} // Prosleđuje trenutne vrednosti filtera za tipove
                    onChange={(items: string[]) => dispatch(setProductParamas({ types: items }))}
                />
            </Paper>

            </Grid>

            {/* Product List */}
            <Grid item xs={12} sm={8} md={9}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                    Products
                </Typography>
                <ProductList products={products} />
              
              <AppPanigration metaData={metaData} onPageChange={(page:number)=>dispatch(setPageNumber({pageNumber:page}))}/>
            </Grid>
        </Grid>
    );
}
