/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
// import fromUnixTime from 'date-fns/fromUnixTime';
// import compareAsc from 'date-fns/compareAsc';
import packageJson from '../../package.json';

// const buildDateGreaterThan = (latestDate, currentDate) => {
//   const latestDateTime = fromUnixTime(latestDate);
//   const currentDateTime = fromUnixTime(currentDate);

//   return compareAsc(latestDateTime, currentDateTime) === -1;
// };

function withClearCache(Component) {
  function ClearCacheComponent(props) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);

    useEffect(() => {
      fetch('/meta.json ')
        .then((response) => response.json())
        .then((meta) => {
          const latestVersionDate = meta.buildDate;
          const currentVersionDate = packageJson.buildDate;

          const shouldForceRefresh = latestVersionDate > currentVersionDate;
          console.log(shouldForceRefresh);
          if (shouldForceRefresh) {
            alert('alert hoga');
            setIsLatestBuildDate(false);
            refreshCacheAndReload();
          } else {
            setIsLatestBuildDate(true);
          }
        });
    }, []);

    const refreshCacheAndReload = () => {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      // delete browser cache and hard reload
      window.location.reload();
    };

    return <>{isLatestBuildDate ? <Component {...props} /> : null}</>;
  }

  return ClearCacheComponent;
}

export default withClearCache;
