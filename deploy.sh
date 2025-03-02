#!/bin/bash

# KAiM Systems Website Deployment Script
# This script deploys the website to an S3 bucket

# Color codes for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration - Edit these variables
S3_BUCKET_NAME="kaimsys" # S3 bucket name
REGION="us-east-1" # Replace with your AWS region
DISTRIBUTION_ID="" # If you're using CloudFront, add your distribution ID here

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}AWS CLI is not installed. Installing now...${NC}"
    
    # Check if Homebrew is installed (macOS)
    if command -v brew &> /dev/null; then
        brew install awscli
    else
        echo -e "${RED}Error: Homebrew is not installed. Please install AWS CLI manually:${NC}"
        echo "1. Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        echo "2. Follow the instructions for your operating system"
        exit 1
    fi
fi

# Check if AWS CLI is configured
if ! aws configure list &> /dev/null; then
    echo -e "${YELLOW}AWS CLI is not configured. Please configure it now:${NC}"
    aws configure
fi

# Directory to deploy
DEPLOY_DIR="public"

# Print deployment info
echo -e "${GREEN}===== KAiM Systems Website Deployment =====${NC}"
echo -e "Deploying to bucket: ${YELLOW}${S3_BUCKET_NAME}${NC}"
echo -e "Region: ${YELLOW}${REGION}${NC}"
echo -e "Source directory: ${YELLOW}${DEPLOY_DIR}${NC}"
echo ""

# Confirm deployment
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment canceled.${NC}"
    exit 0
fi

# Deploy to S3
echo -e "${GREEN}Syncing files to S3...${NC}"
aws s3 sync "$DEPLOY_DIR" "s3://${S3_BUCKET_NAME}/" --delete --region "$REGION"

# Check if the sync was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Website files successfully uploaded to S3!${NC}"
else
    echo -e "${RED}Error: Failed to sync files to S3.${NC}"
    exit 1
fi

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "${GREEN}Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}CloudFront cache invalidation initiated!${NC}"
    else
        echo -e "${RED}Error: Failed to invalidate CloudFront cache.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}===== Deployment Complete =====${NC}"
echo -e "Your website should now be accessible at: ${YELLOW}http://${S3_BUCKET_NAME}.s3-website-${REGION}.amazonaws.com${NC}"
echo -e "or at your custom domain if configured."
