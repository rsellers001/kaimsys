# KAiM Systems Website

This repository contains the website code for KAiM Systems, featuring compliance management solutions and the Compliance Assistant tool.

## Website Structure

- `public/` - The main website files (HTML, CSS, JavaScript)
- `src/` - React source code (if using React components)
- `server/` - Backend server code (if applicable)

## Deployment Instructions

### Option 1: Using the Automated Deployment Script

1. Edit the `deploy.sh` script to configure your S3 bucket name and AWS region:

```bash
# Configuration - Edit these variables
S3_BUCKET_NAME="your-s3-bucket-name" # Replace with your actual bucket name
REGION="us-east-1" # Replace with your AWS region
DISTRIBUTION_ID="" # If you're using CloudFront, add your distribution ID here
```

2. Make the script executable:

```bash
chmod +x deploy.sh
```

3. Run the deployment script:

```bash
./deploy.sh
```

The script will:
- Check if AWS CLI is installed and install it if needed
- Check if AWS CLI is configured and help you configure it if needed
- Sync the website files to your S3 bucket
- Invalidate CloudFront cache if a distribution ID is provided

### Option 2: Manual Deployment via AWS Console

1. Log in to the [AWS Management Console](https://aws.amazon.com/console/)
2. Navigate to the S3 service
3. Find your bucket (likely named similar to your project)
4. Upload the files from the `public` directory to the bucket

### Option 3: Using AWS Amplify (if configured)

If your project is set up with AWS Amplify:

1. Log in to the [AWS Management Console](https://aws.amazon.com/console/)
2. Navigate to the AWS Amplify service
3. Find your existing app and click on it
4. Go to the "Hosting environments" section
5. Click "Deploy" or use the manual deployment option

## S3 Bucket Configuration

For your S3 bucket to serve as a website, ensure it's configured with:

1. Static website hosting enabled
2. Public read access
3. Appropriate bucket policy
4. Suitable CORS configuration if needed

## Additional Resources

- [AWS S3 Website Hosting Documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
- [AWS Amplify Documentation](https://docs.amplify.aws/)

## Contact

For questions about this website deployment, contact the KAiM Systems development team.
