Consider RH is provably unprovable in a certain system $A$ stronger than $ZFC$. Then RH is "true", in other words, provable in the system $A$. The reason is as below:

Let $P(n)$ be the formula that $n$ needs to holds in the RH statement. So RH states that $P(n)$ holds for all $n$. Since $P(n)$ is calculatable, we have (accept it for now) $$\forall n, \neg P(n)\to (\exist s, {\rm Proof}_{ZFC}(s,\neg RH))$$ is a theorem in $A$ (or any system that contains $PA$). Here $s$ is a Gödel number of a proof in $ZFC$ for $\neg RH$.

When we know that $A\vdash (\nexists s, {\rm Proof}_{ZFC}(s,\neg RH))$. We suppose $\neg RH$, or $\exist n, \neg P(n)$, then
$$
A, \neg RH\vdash (\exist s, {\rm Proof}_{ZFC}(s,\neg RH))
$$
this contradicts with $A\vdash (\nexists s, {\rm Proof}_{ZFC}(s,\neg RH))$, meaning that $A\vdash RH$, so RH is provable in $A$.

Now return to $\forall n, \neg P(n)\to (\exist s, {\rm Proof}_{ZFC}(s,\neg RH))$. Is this really a theorem in $A$? Our metalanguage for $ZFC$ is $A$, and if we think of $n$ as the meta natural number, the calculation of $P(n)$ is a proof to $RH$, so an $s$ exists as a Gödel number for this proof. But only saying this doesn't sufficiently show that there $A\vdash \forall n, \neg P(n)\to (\exist s, {\rm Proof}_{ZFC}(s,\neg RH))$. To do this, we need to employ $PA$, which is a subsystem of $A$.

We first show that $A\vdash \neg P(1)\to (\exist s, {\rm Proof}_{ZFC}(s,\neg RH))$. This is because $P(1)$ is a calculatable formula, so we can calculate it in $A$ and get $\neg P(1)$. Next, we inductively show that 
$$
\begin{aligned}
A\vdash& \forall n, (\neg P(n)\to (\exist s, {\rm Proof}_{ZFC}(s,\neg RH)))\\&\to(\neg P(n+1)\to (\exist s, {\rm Proof}_{ZFC}(s,\neg RH)))
\end{aligned}
$$
This is because we can always modify the $s$ for $n$ to get an $s$ for $n+1$.

After this, we apply the mathematical induction to get $$A\vdash \forall n, \neg P(n)\to (\exist s, {\rm Proof}_{ZFC}(s,\neg RH))$$ and the rest is as above. So RH is provable in $A$.