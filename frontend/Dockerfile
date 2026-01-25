FROM node:20-alpine

WORKDIR /app

# 1️⃣ Copy ONLY dependency files first
COPY package.json yarn.lock ./

# 2️⃣ Install deps (cached unless package.json/yarn.lock changes)
RUN yarn install --frozen-lockfile

# 3️⃣ Copy rest of the app
COPY . .

# 4️⃣ Build the app
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
