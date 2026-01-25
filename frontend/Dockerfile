FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy rest of the app
COPY . .

# Build frontend
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
