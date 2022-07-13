import { FindingType, FindingSeverity,Finding, HandleTransaction, createTransactionEvent } from "forta-agent";
import agent from "./agent"
import { createAddress } from "forta-agent-tools/lib/tests";
import { FORTA_CREATE_FUNCTION, FORTA_PROXY_CONTRACT, NETH_DEPLOYER_ADDRESS } from "./constants"

describe("Monitor Nethermind Agent Deployment Function Calls", () => {
  let handleTransaction: HandleTransaction;
  const mockAccount = createAddress("0xabc");
  const mockAddress: string = createAddress("0x123");

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("Handle Transaction", () => {
    it("returns empty findings if transaction is not from the Nethermind deployer address", async () => {
      const mockTxEvent = createTransactionEvent({ transaction: {from: mockAddress}} as any);
      mockTxEvent.filterFunction = jest.fn().mockReturnValue([]);
      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
    });

    it("returns empty findings if transaction does not contain a createAgent function call", async () => {
      const mockTxEvent = createTransactionEvent({ transaction: { from: NETH_DEPLOYER_ADDRESS, to: FORTA_PROXY_CONTRACT }} as any);
      mockTxEvent.filterFunction = jest.fn().mockReturnValue([]);
      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledWith(FORTA_CREATE_FUNCTION, FORTA_PROXY_CONTRACT);
    });

    it("returns a finding if the Nethermind deployer address calls the createAgent function to the proxy contract", async () => {
      const mockDeployAgent = {
        name: "createAgent",
        args: {agentId: 1, owner: mockAccount, metadata: "", chainIds: [1, 2]},
        address: FORTA_PROXY_CONTRACT,
      }
      const mockTxEvent = createTransactionEvent( { transaction: {from: NETH_DEPLOYER_ADDRESS, to: FORTA_PROXY_CONTRACT}} as any);
      mockTxEvent.filterFunction = jest.fn().mockReturnValue([mockDeployAgent]);
      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Nethermind Bot Deployment Detetion",
          description: `${mockDeployAgent.name.toLowerCase()} function call detected.`,
          alertId: "FORTA-BOT-1",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
              agentId: mockDeployAgent.args.agentId.toString(),
              metadata: mockDeployAgent.args.metadata,
              chainIDs: mockDeployAgent.args.chainIds.toString(),
          },
          protocol: "polygon",
          addresses: [mockDeployAgent.address]
        })
      ]);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterFunction).toHaveBeenCalledWith(FORTA_CREATE_FUNCTION, FORTA_PROXY_CONTRACT);
    });
    
  });
});