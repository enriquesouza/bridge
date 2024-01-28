# Use the official Ubuntu 22.04 base image
FROM ubuntu:20.04

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && apt-get upgrade -y && apt-get update -y && apt-get install --no-install-recommends -y \
    git \
    curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update
RUN apt-get install build-essential
RUN apt-get install gcc
RUN apt-get install make
RUN apt-get install git
RUN apt-get install -y bzr
RUN apt-get install jq
RUN wget https://dl.google.com/go/go1.14.1.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.14.1.linux-amd64.tar.gz
RUN 'export GOROOT=/usr/local/go' >> ~/.bashrc
RUN 'export GOPATH=$HOME/go' >> ~/.bashrc
RUN 'export PATH=$PATH:$GOROOT/bin:$GOPATH/bin' >> ~/.bashrc
RUN 'export THETA_HOME=$GOPATH/src/github.com/thetatoken/theta' >> ~/.bashrc

RUN git clone --branch release https://github.com/thetatoken/theta-protocol-ledger.git $GOPATH/src/github.com/thetatoken/theta

# Set the working directory in the container
WORKDIR /app

# Copy the entire project into the container
COPY . .







