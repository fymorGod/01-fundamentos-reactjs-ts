import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';
import { Avatar } from "../Avatar";
import { Comment } from "../Comment";
import styles from "./styles.module.css";

interface Author {
  name: string;
  role: string;
  avatarUrl: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

interface PostProps {
  author: Author;
  publishedAt: Date;
  content: Content[];
}

export function Post({ author, content, publishedAt }: PostProps) {
  const [comments, setComments] = useState([
    'Muito bom Devon, parabéns!! 👏👏'
  ]);
  const [newCommentText, setCommentNewText] = useState('');

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true
  });

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();
    //imutabilidade
    setComments([...comments, newCommentText]); //spread operator
    setCommentNewText('');
  }
  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('');
    
    setCommentNewText(event.target.value)
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Esse campo é obrigatório!')
  }

  function deleteComment(commentToDelete: string) {
    //imutabilidade -> as variáveis não sofrem mutação, nõs criamos um novo valor (umnovo espaço na memõria)
    const commentsWithoutDeletedOne = comments.filter(comment => {
      return comment !== commentToDelete;
    });

    setComments(commentsWithoutDeletedOne);
  }

   const isNewCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar                     
            src={author.avatarUrl}
          />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time dateTime={publishedAt.toISOString()} title={publishedDateFormatted}>
          {publishedDateRelativeToNow}
        </time>
      </header>
      <div className={styles.content}>
        {
          content.map((item) => {
            if(item.type === 'paragraph') {
              return <p key={item.content} >{item.content}</p>
            } else if (item.type === 'link') 
            return <p key={item.content} ><a href="#">{item.content}</a></p>
          })
        }
      </div>
      <form className={styles.commentForm} onSubmit={handleCreateNewComment}>
        <strong>Deixe seu feedback</strong>
        <textarea 
        name='comment'
        placeholder="Deixe um comentário"
        value={newCommentText}
        onChange={handleNewCommentChange}
        onInvalid={handleNewCommentInvalid}
        required
        /> 

        <footer>
          <button type="submit" disabled={isNewCommentEmpty} >
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment => {
          return (
            <Comment
             key={comment} 
             content={comment} 
             onDeleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
