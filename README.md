# Detect Nethermind Forta Bot Deployment

## Description

This bot detects when Forta Bots are deployed from the Nethermind deployment address

## Supported Chains

- Polygon

## Alerts

Describe each of the type of alerts fired by this bot

- FORTA-1
  - Fired when a Forta Bot is deployed from Nethermind 
  - Severity is always set to "info"
  - Type is always set to "info
  - Protocol: Forta
  - Addresses:
    - `Nethermind Deployer Address`: 0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8
  - Metadata
    - `agentId`: The ID for the Forta Bot
    - `metadata`: The IPFS reference to the metadata for the bot
    - `chainIDs`: The chainIDs for the bot

## Test Data

The bot behaviour can be verified with the following transactions:

- tx: 0xdc656b54c52391725f883be8c9d3c0408992ba3c6665b3e38a02477f04c8a5fd 
   - (0 findings as it does not contain a createAgent call)
   
- tx: 0xdc656b54c52391725f883be8c9d3c0408992ba3c6665b3e38a02477f04c8a5fd 
   - (0 findings as it was deployed from a non-Nethermind address "0x183d13c4fCb5133EA52345A9037C9c25A5Aa139D")

- tx: 0x46c5a07d66aec71dc1b12dcf7a036c78c2299cc45c099d981d440f2c67501525
  - (1 finding as the transaction contains a createAgent call from the Nethermind Address "0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8")
