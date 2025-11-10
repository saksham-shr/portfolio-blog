#!/bin/bash

# --- Configuration ---
REPO_URL="https://github.com/saksham-shr/portfolio-blog.git"
PROJECT_DIR="portfolio-blog"
NGINX_CONF_NAME="mern_app"
NGINX_CONF_PATH="/etc/nginx/sites-available/${NGINX_CONF_NAME}"
NGINX_LINK_PATH="/etc/nginx/sites-enabled/${NGINX_CONF_NAME}"
NODE_PORT=5000

# --- Helper Functions ---

# Function to check for errors and exit
check_error() {
    if [ $? -ne 0 ]; then
        echo "ERROR: $1"
        exit 1
    fi
}

# Function to install MongoDB
install_mongodb() {
    echo "--- 1.1 Installing MongoDB ---"
    
    # Install necessary dependencies for adding repository
    sudo apt update
    sudo apt install -y gnupg curl
    check_error "Failed to install gnupg and curl."
    
    # 1. Import the public GPG key
    echo "Importing MongoDB GPG key..."
    curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
       sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
       --dearmor
    check_error "Failed to import MongoDB GPG key."
    
    # 2. Create a list file for MongoDB
    echo "Creating MongoDB list file..."
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    check_error "Failed to create MongoDB list file."
    
    # 3. Reload the local package database
    echo "Updating package list..."
    sudo apt update
    check_error "Failed to update package list after adding MongoDB repo."
    
    # 4. Install the MongoDB packages
    echo "Installing MongoDB (mongodb-org)..."
    sudo apt install -y mongodb-org
    check_error "MongoDB installation failed."
    
    # 5. Start and enable MongoDB service
    echo "Starting and enabling MongoDB service..."
    sudo systemctl start mongod
    check_error "Failed to start MongoDB service."
    sudo systemctl enable mongod
    check_error "Failed to enable MongoDB service."
    
    echo "MongoDB installed and running successfully."
    echo "Note: MongoDB is running on localhost:27017. Your MONGO_URI should be 'mongodb://localhost:27017/mern_blog_portfolio'"
}

# Function to install other dependencies
install_dependencies() {
    echo "--- 1.2 Installing Other System Dependencies (Node.js, PM2, Nginx) ---"
    
    # Install NVM (Node Version Manager)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    check_error "NVM installation failed."
    
    # Source NVM to make it available in the current shell
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Install Node.js LTS
    nvm install --lts
    check_error "Node.js installation failed."
    
    # Install PM2 globally
    npm install -g pm2
    check_error "PM2 installation failed."
    
    # Install Nginx
    sudo apt install -y nginx
    check_error "Nginx installation failed."
    
    echo "Other system dependencies installed successfully."
}

# Function to clone and build the application
setup_application() {
    echo "--- 2. Setting up Application ---"
    
    # Clone the repository
    if [ -d "$PROJECT_DIR" ]; then
        echo "Project directory already exists. Pulling latest changes..."
        cd $PROJECT_DIR
        git pull
        check_error "Git pull failed."
    else
        echo "Cloning repository..."
        git clone $REPO_URL $PROJECT_DIR
        check_error "Git clone failed."
        cd $PROJECT_DIR
    fi
    
    # Check for .env file
    if [ ! -f "server/.env" ]; then
        echo "WARNING: 'server/.env' file not found. Please create it with MONGO_URI and JWT_SECRET."
        echo "Exiting script. Please create the .env file and run the script again."
        exit 1
    fi
    
    # Install backend dependencies
    echo "Installing backend dependencies..."
    cd server
    npm install
    check_error "Backend npm install failed."
    cd ..
    
    # Install frontend dependencies and build
    echo "Installing frontend dependencies and building..."
    cd client
    npm install
    check_error "Frontend npm install failed."
    npm run build
    check_error "Frontend build failed."
    cd ..
    
    echo "Application setup and build complete."
}

# Function to configure Nginx
configure_nginx() {
    echo "--- 3. Configuring Nginx ---"
    
    # Remove default Nginx config
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Create Nginx configuration file
    echo "Creating Nginx configuration file at ${NGINX_CONF_PATH}..."
    
    # Get the public IP of the EC2 instance (optional, but helpful for server_name)
    EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "your_ec2_public_ip")

    sudo bash -c "cat > ${NGINX_CONF_PATH}" <<EOF
server {
    listen 80;
    server_name your_domain.com ${EC2_PUBLIC_IP};

    location / {
        proxy_pass http://localhost:${NODE_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF
    check_error "Failed to write Nginx configuration."
    
    # Create symbolic link
    if [ ! -L "$NGINX_LINK_PATH" ]; then
        echo "Enabling Nginx configuration..."
        sudo ln -s $NGINX_CONF_PATH $NGINX_LINK_PATH
        check_error "Failed to create Nginx symlink."
    fi
    
    # Test and restart Nginx
    echo "Testing and restarting Nginx..."
    sudo nginx -t
    check_error "Nginx configuration test failed."
    sudo systemctl restart nginx
    check_error "Nginx restart failed."
    
    echo "Nginx configured and restarted successfully."
}

# Function to start the application with PM2
start_application() {
    echo "--- 4. Starting Application with PM2 ---"
    
    # Ensure we are in the project root
    cd $HOME/$PROJECT_DIR
    
    # Stop any existing process with the same name
    pm2 delete mern-api 2> /dev/null
    
    # Start the application
    # We set NODE_ENV=production here to ensure the server serves the client build
    pm2 start server/index.js --name "mern-api" --env production
    check_error "PM2 failed to start the application."
    
    # Save the process list for startup on reboot
    pm2 save
    
    echo "Application 'mern-api' started successfully with PM2."
    echo "Check status with: pm2 status"
}

# --- Main Execution ---

# Check if script is run as root (which is not recommended for npm/nvm)
if [ "$EUID" -eq 0 ]; then
    echo "Please do NOT run this script as root. Run it as a regular user (e.g., 'ubuntu')."
    exit 1
fi

# Execute steps
install_mongodb
install_dependencies
setup_application
configure_nginx
start_application

echo "====================================================="
echo "DEPLOYMENT COMPLETE!"
echo "====================================================="
echo "NEXT STEPS:"
echo "1. Ensure your EC2 Security Group has ports 22 (SSH) and 80 (HTTP) open."
echo "2. Your application should be accessible at your EC2 instance's public IP address."
echo "3. If you are using a domain, remember to update 'your_domain.com' in ${NGINX_CONF_PATH} and restart Nginx."
echo "4. You MUST update 'server/.env' with the local MongoDB URI: 'mongodb://localhost:27017/mern_blog_portfolio'"
echo "5. After updating the .env file, restart the app: 'pm2 restart mern-api'"
echo "====================================================="
