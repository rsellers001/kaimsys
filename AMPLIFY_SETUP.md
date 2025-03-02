# AWS Amplify Setup Guide

This document outlines the steps to deploy the KAiM Systems Compliance Assistant using AWS Amplify.

## 1. Environment Variables Configuration

### Set up environment variables in AWS Amplify Console:

1. **Go to the AWS Amplify Console**:
   - Log in to your AWS account
   - Navigate to the Amplify service
   - Select your application

2. **Configure Environment Variables**:
   - Go to the "Environment variables" section
   - Add the following environment variable:
     - Key: `OPENAI_API_KEY`
     - Value: [Use the OpenAI API key provided to you separately]
   - Check the option to make this variable available to the build

3. **Save the environment variables**

## 2. Deployment Options

### Option A: Connect to GitHub Repository (Recommended)

1. **Connect Repository**:
   - In the Amplify Console, choose "Host web app"
   - Select GitHub as the repository source
   - Connect to your GitHub account
   - Select the repository: `rsellers001/kaimsys`
   - Choose the main branch

2. **Configure Build Settings**:
   - Amplify should automatically detect the amplify.yml file
   - Review the build settings to ensure they match your requirements

3. **Start the Deployment**:
   - Click "Save and deploy"
   - Amplify will clone your repository and start the build process

### Option B: Manual Deployment Using Amplify CLI

If you prefer using the Amplify CLI:

1. **Install Amplify CLI**:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Initialize Amplify**:
   ```bash
   amplify init
   ```

3. **Add Hosting**:
   ```bash
   amplify add hosting
   ```

4. **Deploy**:
   ```bash
   amplify publish
   ```

## 3. After Deployment

1. **Update Frontend Configuration**:
   - If needed, update `compliance-assistant.html` to use the proper backend URL
   - Set `simulationMode = false` to use the real OpenAI integration

2. **Test the Integration**:
   - Visit the deployed URL
   - Test sending messages to the Compliance Assistant
   - Verify that responses come from the OpenAI Assistant

## Troubleshooting

- **CORS Issues**: If experiencing CORS errors, make sure API Gateway has proper CORS configuration
- **Environment Variables**: If the OpenAI API isn't working, verify the environment variable is correctly set
- **Deployment Failures**: Check the build logs in the Amplify Console for specific error messages

## Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
