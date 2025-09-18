const CertificationsSection = ({ certifications, parseCertifications }) => {

  const certList = parseCertifications(certifications);
  return (
    <div className="dashboard-section">
      <h3>🎓 Certifications & Awards</h3>
      {certList.length > 0 ? (
        <ul>
          {certList.map((cert, i) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      ) : (
        <p>No certifications listed.</p>
      )}
    </div>
  );
};
export default CertificationsSection;