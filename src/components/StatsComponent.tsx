import * as React from "react";
import "@assets/scss/Stats.scss";

type Props = {
};

class StatsComponent extends React.Component<Props>
{
  render() {
    return <div className="relative-height stats">
      <p>(Work In Progress)</p>
      <p>Cet outil est en plein développement et risque de contenir beaucoup de bugs, mais il sera mis à jour très régulièrement. (Je ne suis pas responsable si un ordinateur prend feu :eyes:)</p>
      <p>Je suis ouvert à toutes recommandations à propos de l'outil mais j'ai déjà beaucoup d'idées qui attendent d'être implémentées.</p>
      <p>Fait par Vinaigre (Discord: Vinaigre#4083)</p>
      <p><a style={{ color: "yellow" }} href="https://github.com/Vinaigre1/dofus-trap-network">Le code est open-source !</a></p>
    </div>;
  }
}

export default StatsComponent;
