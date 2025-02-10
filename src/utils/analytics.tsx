import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";
import { gapi } from "gapi-script";
import React from "react";

export const initGA = () => {
  const trackingId = process.env.REACT_APP_ANALYTICS as string;
  if (!trackingId) {
    console.error("Google Analytics Measurement ID not provided");
    return;
  }
  ReactGA.initialize(trackingId);
};

export const logPageView = (pathName: string) => {
  ReactGA.send({ hitType: "pageview", page: pathName });
};
export const RouteChangeTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  return null;
};

export const initClientGA = () => {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      apiKey: `${process.env.REACT_APP_G_API_KEY}`,
      clientId: `${process.env.REACT_APP_G_CLIENT_ID}`,
      discoveryDocs: [
        "https://analyticsreporting.googleapis.com/$discovery/rest?version=v4",
      ],
      scope: "https://www.googleapis.com/auth/analytics.readonly",
    });
  });
};

export const fetchPageViews = async (path: string, startDate?: string) => {
  const response = await gapi.client.analyticsreporting.reports.batchGet({
    reportRequests: [
      {
        viewId: `${process.env.REACT_APP_ANALYTICS}`,
        dateRanges: [
          { startDate: startDate ?? "2005-01-01", endDate: "today" },
        ],
        metrics: [{ expression: "ga:pageviews" }],
        dimensions: [{ name: "ga:pagePath" }],
        filtersExpression: `ga:pagePath==${path}`,
      },
    ],
  });
  return response.result.reports[0].data.totals[0].values[0];
};

export const PageViews: React.FC<{ path: string; startDate?: string }> = ({
  path,
  startDate,
}) => {
  const [pageViews, setPageViews] = useState<string>("");
  useEffect(() => {
    fetchPageViews(path, startDate).then((res) => setPageViews(res));
  }, [path, startDate]);
  return <>{pageViews}</>;
};

export const trackShare = (platform: string) => {
  ReactGA.event({
    category: "Social",
    action: `Share to ${platform}`,
  });
};
