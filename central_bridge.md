# Theta central bridge

### User Interaction Flow

1. **User Visits Website**: The user navigates to the website (replay.bridge), which is designed to resemble Uniswap and Thor Chain interfaces.
   
2. **Network and Token Selection**:
   - The user selects the Theta network on MetaMask.
   - The website automatically selects the Replay token in the "From" field.

3. **Exchange Setup**:
   - The user intends to exchange Replay Theta for Replay Ethereum.
   - The website calculates the transaction fees on both the Theta and Ethereum networks and converts these fees into the equivalent amount of Replay tokens.

4. **Fee Calculation and Display**:
   - If the exchange rate is 1 REPLAY = 1 USD, and the fees are 20 cents (Theta) and 20 dollars (ETH), the total cost in Replay tokens is displayed to the user (e.g., 1 REPLAY + 20 USD in ETH fees = 21 REPLAYs).

5. **Transaction Initiation**:
   - The user clicks a button to create the transaction.
   - The website sends a message via API indicating that someone is attempting to bridge 1 REPLAY.

6. **Address Generation and Fee Estimation**:
   - A new, transaction-specific address is generated and returned to the user.
   - An Ethereum transaction fee estimate is calculated, displayed to the user, and another button labeled "Deposit (Transfer or Send)" is activated.

### Transaction Processing Flow

7. **Monitoring for Deposit**:
   - The system starts monitoring the new address for incoming transactions for about 1 hour.

8. **User Makes the Deposit**:
   - The user clicks the "Deposit" button, prompting MetaMask to open and ask for authorization to send the specified amount to the generated address.
   - The user sends the amount in REPLAY tokens to the specified address.

9. **Verification and Processing**:
   - The system verifies if the correct amount (e.g., 21 REPLAYs) was sent.
   - If the sent amount is incorrect, the system either:
     - Refunds the amount minus the Theta fee, or
     - Requests the user to send the remaining needed amount.

10. **Completion of Bridge Transaction**:
    - Once the correct amount is received, the sending service is triggered to transfer the requested amount in Ethereum to the user.
    - After the Ethereum transfer is completed, the job is marked as paid and finished, and the monitoring job is terminated.

# Technical informations

### 1. Store the Private Key on AWS/Heroku Secrets

To ensure security, it is crucial for me to store the private key securely. Both AWS and Heroku offer solutions for storing secrets:

- **AWS Secrets Manager**: Allows me to store, manage, and retrieve secrets.
- **Heroku Config Vars**: Allows me to define environment variables (secrets) that are secure and accessible by my application.

### 2. Create a Subscription to a Signature on a Blockchain Address

Since Theta only supports HTTP, I will need to create a service that:

- Performs regular polling to the desired address on the blockchain to check for new transactions.
- Uses a queue to manage checks and notifications efficiently.
	- I will develop a service that checks for each order the address.
	- This service should check for a maximum of one hour.
	- If the order has more than one hour, it should expire.
	- The job should be canceled.
- After I find the deposit, I will notify the app via SSE or WebSocket.
	- As soon as our app finds the deposit, we are able to send from the other network to the user that is bridging the token.

### 3. WebSocket for Monitoring

Even though Theta does not directly support WebSocket, I can create an intermediary service that:

- Performs polling on the blockchain via HTTP.
- Updates a custom WebSocket with the new information, allowing clients to subscribe and receive updates in real-time.

### 4. Open Source Libraries/Frameworks for Creating and Monitoring Orders

For Go, some recommended libraries/frameworks are:

- **go-redis/redis**: Redis client for Go, useful for implementing the processing queue.
- **gorilla/websocket**: WebSocket package for Go.

### 5. Equivalents to ApScheduler and BackgroundScheduler

- **AWS Lambda with CloudWatch Events**: Allows me to execute Lambda functions at defined times, similar to what ApScheduler and BackgroundScheduler do. I can set up CloudWatch events to trigger my Lambda functions as needed.

- **Google Cloud Scheduler**: Works as a fully managed cron job in the cloud, allowing me to schedule task execution at any interval. It can be used to trigger Google Cloud Function functions, which is similar to using AWS Lambda with CloudWatch Events.
