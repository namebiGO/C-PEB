import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description = "C-PEB bridges the gap between brilliant businesses that need growth and authentic creators who can deliver it. Explore our services for startups, MSMEs, and creators.", 
  name = "C-PEB", 
  type = "website" 
}) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      
      {/* End of standard metadata tags */}
      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* End of OpenGraph tags */}
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* End of Twitter tags */}
    </Helmet>
  );
}
