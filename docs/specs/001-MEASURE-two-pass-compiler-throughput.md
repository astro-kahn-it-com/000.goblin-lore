# 📉 PERFORMANCE AUDIT: [AUDIT-002] TWO-PASS CORPUS COMPILER THROUGHPUT

### **I. SUCCESS CRITERIA (Pass/Fail Limits)**

**Primary Metric:** Compilation execution time <= 2000ms for 1,000 entity Markdown files **Allowed
Regression:** Max 5% execution time increase **Test Environment:** Staging Build Server

### **II. LOAD SCENARIOS (Stress Conditions)**

**Concurrency:** 100 parallel file read workers **Network Conditions:** Local NVMe Disk I/O
**Resource Limits:** V8 Heap < 1024MB, CPU Limit = 2.0 cores

---

### **III. AUTOMATION & TOOLING**

**Testing Tool:** Vitest **Failure Threshold:** Compilation time > 2000ms OR malformed data
leakage > 0 **Config File:** `goblin-lore/tests/compiler-throughput.bench.ts`

---

### **IV. TRACEABILITY & ATTRIBUTES**

- **Status:** [🔴 Critical]
- **Epic:** [EPIC EPIC-002: THE CORPUS COMPILER]
- **Policy:** [[POL-02] ZOD SCHEMA ABSOLUTE COMPLIANCE]
- **Component:** [Lore, Engine]
