import pandas as pd

class SecurityPolicyEngine:
    def __init__(self):
        self.thresholds = {
            "CRITICAL": 0,
            "HIGH": 5,
            "MEDIUM": 20
        }

    def evaluate_image_trust(self, findings: list, is_signed: bool):
        """
        Evaluates whether an image is allowed to deploy based on vulnerabilities and trust.
        """
        df = pd.DataFrame(findings)
        severity_counts = df['severity'].value_counts().to_dict()
        
        # Check against thresholds
        for severity, limit in self.thresholds.items():
            if severity_counts.get(severity, 0) > limit:
                return {"decision": "REJECT", "reason": f"Too many {severity} vulnerabilities."}
        
        if not is_signed:
            return {"decision": "REJECT", "reason": "Image signature missing or invalid."}
            
        return {"decision": "ALLOW", "reason": "Policy compliant."}

    def calculate_risk_score(self, findings: list):
        """
        Calculates a weighted risk score (0-100, where 100 is best).
        """
        weights = {"CRITICAL": 25, "HIGH": 10, "MEDIUM": 2, "LOW": 0.5}
        total_deduction = 0
        for f in findings:
            total_deduction += weights.get(f['severity'], 0)
        
        score = max(0, 100 - total_deduction)
        return round(score, 2)

if __name__ == "__main__":
    engine = SecurityPolicyEngine()
    test_findings = [
        {"severity": "CRITICAL", "package": "libssl"},
        {"severity": "HIGH", "package": "node-fetch"}
    ]
    result = engine.evaluate_image_trust(test_findings, is_signed=True)
    print(f"Policy Decision: {result}")
    
    score = engine.calculate_risk_score(test_findings)
    print(f"Image Risk Score: {score}")
