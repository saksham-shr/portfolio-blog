# Comprehensive AWS EC2 Deployment Guide for MERN Stack Application

This guide provides a step-by-step process for deploying your MERN (MongoDB, Express, React, Node.js) stack application to an Amazon Web Services (AWS) EC2 instance.

## Prerequisites

1.  **AWS Account:** An active AWS account.
2.  **EC2 Instance:** A running EC2 instance (e.g., Ubuntu 22.04 LTS).
3.  **SSH Access:** SSH access to your EC2 instance.
4.  **Domain Name (Optional):** A registered domain name if you plan to use a reverse proxy (like Nginx) for production.

## Step 1: Install Dependencies on EC2

Log in to your EC2 instance via SSH and install the necessary software.

### 1.1 Install Node.js and npm

We recommend using Node Version Manager (NVM) for managing Node.js versions.

\`\`\`bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM (you might need to close and reopen your terminal)
. ~/.nvm/nvm.sh

# Install Node.js (LTS version)
nvm install --lts

# Verify installation
node -v
npm -v
\`\`\`

### 1.2 Install MongoDB (or use a cloud service like MongoDB Atlas)

For simplicity and production readiness, **using MongoDB Atlas is highly recommended**. If you must install it on the same EC2 instance:

\`\`\`bash
# Install MongoDB (for Ubuntu)
sudo apt update
sudo apt install -y mongodb

# Start and enable MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
\`\`\`
**Note:** If using MongoDB Atlas, you will only need the connection string (`MONGO_URI`).

### 1.3 Install PM2 (Process Manager)

PM2 is essential for keeping your Node.js application running continuously and managing restarts.

\`\`\`bash
npm install -g pm2
\`\`\`

### 1.4 Install Nginx (Reverse Proxy)

Nginx will serve your React static files and proxy API requests to your Node.js backend.

\`\`\`bash
sudo apt install -y nginx
\`\`\`

## Step 2: Transfer Application Files

Transfer your local `mern-blog-ec2` directory to the EC2 instance. You can use `scp` or `git`.

### Option A: Using SCP (Secure Copy)

From your **local machine**:

\`\`\`bash
scp -r /path/to/mern-blog-ec2 ubuntu@<your-ec2-public-ip>:/home/ubuntu/
\`\`\`

### Option B: Using Git (Recommended)

1.  Push your code to a private Git repository (GitHub, GitLab, etc.).
2.  On your **EC2 instance**, clone the repository:

\`\`\`bash
git clone <your-repo-url> mern-blog-ec2
cd mern-blog-ec2
\`\`\`

## Step 3: Configure and Build the Application

### 3.1 Backend Setup

On your **EC2 instance**, navigate to the server directory:

\`\`\`bash
cd mern-blog-ec2/server
npm install
\`\`\`

**Crucially, update your `.env` file** with the correct `MONGO_URI` (from MongoDB Atlas or your local MongoDB setup) and a strong `JWT_SECRET`.

\`\`\`bash
# Example .env content
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/mern_blog_portfolio?retryWrites=true&w=majority
JWT_SECRET=YOUR_VERY_STRONG_SECRET_KEY
NODE_ENV=production
\`\`\`

### 3.2 Frontend Build

Navigate to the client directory and build the production-ready static files.

\`\`\`bash
cd ../client
npm install
npm run build
\`\`\`
This creates a `build` folder inside `mern-blog-ec2/client/`.

## Step 4: Start the Backend Server with PM2

Navigate back to the root of your project and start the server using PM2.

\`\`\`bash
cd .. # Back to mern-blog-ec2
pm2 start server/index.js --name "mern-api"
pm2 save # Save the process list to be restored on reboot
\`\`\`

**Note:** The `server/index.js` is configured to serve the static files from `../client/build` when `NODE_ENV` is set to `production`.

## Step 5: Configure Nginx as a Reverse Proxy

We will configure Nginx to listen on port 80 and proxy all requests to the Node.js server (running on port 5000 by default).

1.  Remove the default Nginx configuration:

\`\`\`bash
sudo rm /etc/nginx/sites-enabled/default
\`\`\`

2.  Create a new configuration file:

\`\`\`bash
sudo nano /etc/nginx/sites-available/mern_app
\`\`\`

3.  Paste the following configuration (replace `your_domain.com` if you have one):

\`\`\`nginx
server {
    listen 80;
    server_name your_domain.com <your-ec2-public-ip>; # Use your domain or IP

    location / {
        # Proxy all requests to the Node.js server
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

4.  Create a symbolic link to enable the configuration:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/mern_app /etc/nginx/sites-enabled/
\`\`\`

5.  Test the Nginx configuration and restart Nginx:

\`\`\`bash
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

Your MERN application should now be accessible via your EC2 instance's public IP address or domain name.

## Troubleshooting

| Issue | Potential Solution |
| :--- | :--- |
| **502 Bad Gateway** | Check if your Node.js server is running (`pm2 status`). Ensure the Nginx `proxy_pass` port matches your Node.js port (default 5000). |
| **Connection Timed Out** | Check your AWS EC2 Security Group settings. Ensure port 80 (HTTP) and port 22 (SSH) are open to the world (0.0.0.0/0). |
| **Frontend Not Loading** | Ensure `npm run build` was successful and the `client/build` directory exists. Verify the `NODE_ENV=production` in your server's `.env` file. |
| **API Calls Fail (CORS)** | If you are not using Nginx or are testing locally, ensure your `cors` configuration in `server/index.js` is correctly set up to allow requests from your frontend's origin. |
\`\`\`
