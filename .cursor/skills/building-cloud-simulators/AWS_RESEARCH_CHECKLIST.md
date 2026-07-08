# AWS Research Checklist

Use this for AWS simulators before writing architecture content.

## Source Priority

Prefer sources in this order:

1. AWS official documentation pages:
   - service User Guide
   - Developer Guide
   - API Reference only when API behavior matters
   - VPC/networking docs for connectivity, endpoints, ports, routing
   - IAM docs for permissions and trust boundaries
   - Quotas docs for limits
2. AWS official blogs only for patterns not fully covered by docs.
3. AWS workshops only for examples, never as the only source for product behavior.
4. Third-party sources are background only. Do not use them as claim authority.

## Required Research Areas

Fill these before implementation:

- Service purpose and managed responsibility boundary.
- Required and optional components.
- Control plane flows.
- Data plane flows.
- Network ports, protocols, endpoints, and routing assumptions.
- IAM roles, service-linked roles, and permissions that affect architecture.
- Resource lifecycle: create, update, test, cutover/failover, rollback, cleanup.
- Regional, account, VPC, subnet, and availability-zone boundaries.
- Quotas, limits, unsupported configurations, and prerequisites.
- Security posture: encryption, secrets, agent behavior, logs, audit.
- Cost-relevant resources: running compute, storage, snapshots, data transfer.
- Operational states: healthy, syncing, degraded, failed, finalized.

## Claim Traceability

Use this format in the blueprint/spec:

```markdown
- Claim: Replication data uses TCP 1500 from source agent to replication server.
  Source: <official AWS doc URL>
  Accessed: YYYY-MM-DD
  Simulator use: Step 3 and Step 4 data-plane pipe.
```

If a claim cannot be confirmed:

- do not render it as fact
- mark it as an assumption or project simplification
- ask the user before using it for the teaching flow

## Freshness Rules

- Use web research for AWS docs when the simulator depends on product details.
- Prefer current docs over memory, previous conversations, or older simulator content.
- Record access date in the blueprint/spec.
- If docs disagree, use the more specific official doc and note the conflict.

## AWS Simulator Accuracy Review

Before completion, check:

- [ ] No deprecated service names unless explaining legacy behavior.
- [ ] Ports and protocols match official docs.
- [ ] Data plane and control plane are visually distinct.
- [ ] Components are named with official AWS terminology.
- [ ] Simplifications are explicitly documented.
- [ ] Failure/edge states do not imply unsupported AWS behavior.
- [ ] Cleanup/finalization behavior is covered when resources are created.
