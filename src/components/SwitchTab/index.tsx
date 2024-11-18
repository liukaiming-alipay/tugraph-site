import styles from './index.less';
import cx from 'classnames';

interface ISwitchTabProps {
  options: { value: string; label: string }[];
  current?: string;
  onChange?: (value: string) => void;
}
const SwitchTab = ({ options, current, onChange }: ISwitchTabProps) => {
  return (
    <div className={styles.tabList}>
      {options.map((item) => (
        <div
          className={cx(
            styles.tabItem,
            item.value === current ? styles.tabActived : '',
          )}
          onClick={() => onChange?.(item.value)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default SwitchTab;
