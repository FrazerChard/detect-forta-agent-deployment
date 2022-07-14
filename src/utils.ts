import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const generateFinding = (args: any, address: string): Finding => {
  return Finding.fromObject({
    name: "Nethermind Bot Deployment Detetion",
    description: "CreateAgent function call detected.",
    alertId: "FORTA-BOT-1",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    metadata: {
      agentId: args.agentId.toString(),
      metadata: args.metadata,
      chainIDs: args.chainIds.toString(),
    },
    protocol: "polygon",
    addresses: [address],
  });
};
