import { Anchor } from 'antd';
import { useEffect, useMemo } from 'react';
import { remark } from 'remark';
import parse from 'remark-parse';
import styles from './index.less';
import { onPathAddSearch, slugify } from '@/util';
import { history } from 'umi';
import { useActivity } from '@/hooks/useActivity';

const { Link } = Anchor;

const InfoRight = ({
  detail,
  list,
}: {
  detail?: API.BlogDetailVO;
  list?: API.BlogListVO[];
}) => {
  const { getLastActicity, lastDetial } = useActivity();
  const headings = useMemo(() => {
    const headings: any = [];

    const tree = remark().use(parse).parse(detail?.content);

    tree?.children
      ?.filter((node) => node.type === 'heading')
      .forEach((node) => {
        const level = node.depth; //2
        const text = node.children.map((child) => child?.value).join('');

        if (level > 3) {
          return;
        }

        if (!headings?.length) {
          headings.push({ level, text });
        } else {
          if (headings[headings.length - 1]?.level < level) {
            headings.splice(headings.length - 1, 1, {
              ...headings[headings.length - 1],
              children: [
                ...(headings[headings.length - 1]?.children || []),
                { level, text },
              ],
            });
          } else {
            headings.push({ level, text });
          }
        }
      });

    return headings;
  }, [detail]);

  useEffect(() => {
    getLastActicity('REGISTRATION_DURING');
  }, []);

  const renderLink = (item: any) => {
    if (item?.text) {
      return (
        <Link
          href={`#${slugify(item?.text)}`}
          title={slugify(item?.text, true)}
        >
          {item?.children?.length
            ? item?.children?.map((childItem: any) => renderLink(childItem))
            : null}
        </Link>
      );
    } else if (item?.children?.length) {
      return item?.children?.map((childItem: any) => renderLink(childItem));
    }

    return null;
  };

  return (
    <div className={styles.InfoRight}>
      {headings.length ? (
        <Anchor
          className={styles.blogAnchor}
          affix={false}
          getContainer={() =>
            document?.getElementById('blog-content') || window
          }
          offsetTop={100}
          targetOffset={100}
        >
          {headings?.map((item: any) => {
            return renderLink(item);
          })}
        </Anchor>
      ) : null}

      {list?.length ? (
        <div className={styles.newest}>
          <div className={styles.newestTitle}>最新博客</div>
          {list?.map((item) => (
            <div
              key={item?.id}
              className={styles.newestItem}
              onClick={() =>
                history.push(onPathAddSearch('/blog/info', { id: item.id }))
              }
            >
              {item.title}
            </div>
          ))}
        </div>
      ) : null}
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${lastDetial?.backgroundImage?.url})`,
        }}
        onClick={() =>
          onPathAddSearch('/activity/info/', { id: lastDetial?.id })
        }
      ></div>
    </div>
  );
};

export default InfoRight;
