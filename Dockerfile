FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Enable corepack and set pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source
COPY . .

EXPOSE 9000

# Default to production start; compose overrides with dev
CMD ["pnpm", "start"]

