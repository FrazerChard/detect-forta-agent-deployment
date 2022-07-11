import { Finding, HandleTransaction, TransactionEvent, } from "forta-agent";
import { FORTA_CREATE_FUNCTION, NETH_DEPLOYER_ADDRESS, FORTA_PROXY_CONTRACT } from "./constants";
import { generateFinding } from "./utils"

const handleTransaction: HandleTransaction = async ( txEvent: TransactionEvent ): Promise<Finding[]> => {
  const findings: Finding[] = [];
  if (txEvent.from != NETH_DEPLOYER_ADDRESS.toLowerCase()) return findings;
  txEvent.filterFunction(FORTA_CREATE_FUNCTION, FORTA_PROXY_CONTRACT).forEach((createAgentCall) => {
    findings.push(
      generateFinding(
        createAgentCall.name,
        createAgentCall.args,
        createAgentCall.address
    ));
  });
  return findings;
};

export default {
  handleTransaction
}