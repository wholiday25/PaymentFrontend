import React, { useEffect, useState } from "react";
import { 
    Card, 
    Text, 
    Button, 
    Flex, 
    Box,
    Title,
    Loader } from '@mantine/core';
import axios from "axios";
import { SERVER_ADDRESS } from "../utils/consts";
import { getStripe } from "../utils/stripe-client";

interface Product {
    id: string,
    name: string,
    price: string,
    interval: string,
    currency: string,
    description: string
};

const Stripe = () => {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isSubscribe, setIsSubscribe] = useState<boolean>(false);

     useEffect(() =>{
        const fetch = async() => {
            axios.get(`${SERVER_ADDRESS}/products/getProducts`).then(response => {
                const data = response.data;
                if(data){
                    setProducts(data);
                }
            }).catch(error => {
                console.log(error);
            })
        }
        fetch();
    }, [])
    const handleCheckout = (product: Product) => {
        if(isSubscribe) return;
        
        const return_url:string = window.location.href;
        let priceId:string = product.id;
    
        const params:{
            return_url: string,
            priceId: string
        } = {
            return_url: return_url,
            priceId: priceId
        };
        setIsSubscribe(true);
        axios.post(`${SERVER_ADDRESS}/products/create-checkout-session`,
            {
                params
            }
        ).then(async(response) => {
            const data = response.data;
            const sessionId:string = data.sessionId;
            const stripe = await getStripe();
                stripe?.redirectToCheckout({ sessionId });
        }).catch(error => {
            console.log(error);
            setIsSubscribe(false);
        })
    }
    return (
        <Box
            mt="60px"
        >
            <Title order={1} align="center">Stripe Payment</Title>
            <Flex
                gap='md'
                mt="lg"
                justify='center'
            >
            {
                products.length === 0?<Loader variant="bars"/>:
                products.map((product, index) =>
                <Card shadow="sm" padding="lg" radius="md" withBorder sx={(theme)=>({
                    width: '300px'
                })}>
                        <Card.Section>
                            {
                                <Flex
                                    gap={"sm"}
                                    direction={"column"}
                                    mt="md"
                                >
                                    <Title order={2} align="center">{product.name}</Title>
                                    <Title order={2} align="center">${Number(product.price)/100}/{product.interval}</Title>
                                </Flex>
                            }
                        </Card.Section>
    
                        
                        <Text size="sm" color="dimmed" mt="md">
                            {product.description}
                        </Text>
    
                        <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={() => {handleCheckout(product)}}>
                            {
                                isSubscribe?<Loader variant="dots"/>:'Subscribe'
                            }
                        </Button>
                    </Card>
                )
            }
            
            </Flex>
        </Box>
        
    )
}
export default Stripe;