-- PlayerData
-- admin
SELECT pl.ScorePoints, a.AverageScore, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
JOIN alliance a ON a.WorldId=pl.WorldId AND a.AllianceId=p.AllianceId
WHERE pl.WorldId=264
AND pl.Zeit=a.Zeit
AND pl.AccountId=2906176
ORDER BY pl.Zeit ASC

-- player
SELECT pl.ScorePoints, a.AverageScore, pl.OverallRank, pl.EventRank, pl.GesamtTiberium, pl.GesamtCrystal, pl.GesamtPower, pl.GesamtCredits, pl.ResearchPoints, pl.Credits, pl.Shoot, pl.PvP, pl.PvE, pl.LvLOff, pl.BaseD, pl.OffD, pl.DefD, pl.DFD, pl.SupD, pl.VP, pl.LP, pl.RepMax, pl.CPMax, pl.CPCur, pl.Funds FROM player pl
JOIN relation_player p ON p.WorldId=pl.WorldId AND p.AccountId=pl.AccountId
JOIN alliance a ON a.WorldId=pl.WorldId AND a.AllianceId=p.AllianceId
WHERE
pl.Zeit=a.Zeit
AND
pl.WorldId=264
AND
p.AllianceId IN
(
    SELECT p.AllianceId FROM relation_player p WHERE p.WorldId=264 AND p.AccountId=2906176
)
AND
pl.AccountId IN
(
    SELECT p.AccountId FROM relation_player p
    JOIN relation_alliance a ON a.WorldId=p.WorldId AND a.AllianceId=p.AllianceId
    WHERE
    p.WorldId=264
    AND
	IF
    (
        p.MemberRole<=a.MemberRole,
        true,
        p.AccountId=2906176
    )
)
ORDER BY pl.Zeit ASC