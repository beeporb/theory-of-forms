import { Icon } from '../common/Icon';

export function SecretCollectorCard() {
  return (
    <section className="panel collector-card collector-card--secret">
      <h3 className="panel__title collector-card__title">
        <span className="collector-card__icon">
          <Icon name="help" />
        </span>
        ???
      </h3>
      <p className="collector-card__flavor">
        Something's out there. You haven't earned the introduction yet.
      </p>
    </section>
  );
}
