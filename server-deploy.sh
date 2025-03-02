#!/bin/bash

# KAiM Systems Server Deployment Script for EC2

# Color codes for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration variables
EC2_USER="ec2-user"
EC2_HOST="your-ec2-instance-ip" # Replace with your EC2 instance IP or domain
SERVER_DIR="/home/ec2-user/kaimsys-server"
PEM_FILE="path/to/your-key.pem" # Replace with the path to your .pem file

# Print deployment info
echo -e "${GREEN}===== KAiM Systems Server Deployment =====${NC}"
echo -e "Deploying to EC2 host: ${YELLOW}${EC2_HOST}${NC}"
echo -e "Server directory: ${YELLOW}${SERVER_DIR}${NC}"
echo ""

# Confirm deployment
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment canceled.${NC}"
    exit 0
fi

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo -e "${RED}Error: server/.env file does not exist.${NC}"
    echo -e "Please create a .env file with your OpenAI API key:"
    echo -e "Copy server/.env.example to server/.env and add your actual API key."
    exit 1
fi

# Create server directory on EC2 if it doesn't exist
echo -e "${GREEN}Creating server directory on EC2...${NC}"
ssh -i "$PEM_FILE" ${EC2_USER}@${EC2_HOST} "mkdir -p ${SERVER_DIR}"

# Copy server files to EC2
echo -e "${GREEN}Copying server files to EC2...${NC}"
scp -i "$PEM_FILE" -r server/* ${EC2_USER}@${EC2_HOST}:${SERVER_DIR}/

# Install dependencies and start server
echo -e "${GREEN}Installing dependencies and starting server...${NC}"
ssh -i "$PEM_FILE" ${EC2_USER}@${EC2_HOST} "cd ${SERVER_DIR} && npm install && pm2 stop kaimsys-server || true && pm2 start server.js --name kaimsys-server"

# Check if the deployment was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Server successfully deployed to EC2!${NC}"
    echo -e "Your server should now be running at: ${YELLOW}http://${EC2_HOST}:3001${NC}"
else
    echo -e "${RED}Error: Failed to deploy server to EC2.${NC}"
    exit 1
fi

echo -e "${GREEN}===== Deployment Complete =====${NC}"
echo -e "Don't forget to configure your frontend to point to this server."
echo -e "If you need to restart the server, run: ${YELLOW}ssh -i \"$PEM_FILE\" ${EC2_USER}@${EC2_HOST} \"cd ${SERVER_DIR} && pm2 restart kaimsys-server\"${NC}"
