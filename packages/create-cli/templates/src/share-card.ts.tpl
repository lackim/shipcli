import type { SatoriElement } from "@shipcli/share";

export interface ShareCardData {
  target: string;
  status: string;
}

export function shareCard(data: ShareCardData): SatoriElement {
  return {
    type: "div",
    props: {
      style: {
        alignItems: "center",
        background: "#0a0a0a",
        color: "#e5e5e5",
        display: "flex",
        fontFamily: "Inter",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      },
      children: {
        type: "div",
        props: {
          style: {
            border: "2px solid #262626",
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "56px",
            width: "100%",
          },
          children: [
            {
              type: "div",
              props: {
                style: { color: "#06b6d4", fontSize: 28, fontWeight: 700 },
                children: "{{name}}",
              },
            },
            {
              type: "div",
              props: {
                style: { fontSize: 48, fontWeight: 700 },
                children: `Analysis: ${data.status}`,
              },
            },
            {
              type: "div",
              props: {
                style: { color: "#a3a3a3", fontSize: 24 },
                children: `Target: ${data.target}`,
              },
            },
          ],
        },
      },
    },
  };
}
