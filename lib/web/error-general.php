<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="public/favicon.ico">

<title>Uh oh!</title>
<link href="public/css/bootstrap.css" rel="stylesheet">
<link href="public/css/sticky-footer-navbar.css" rel="stylesheet">
</head>

<body data-spy="scroll" data-target="#nav-top">
	<div id="wrap">
		<nav id="nav-top" class="navbar navbar-default navbar-fixed-top"
			role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse"
						data-target=".navbar-collapse">
						<span class="sr-only">Toggle navigation</span> <span
							class="icon-bar"></span> <span class="icon-bar"></span> <span
							class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">Uh Oh!</a>
				</div>
				<div class="collapse navbar-collapse">
				</div>
			</div>
		</nav>

		<div class="container">
			<p><?php echo $data['message']?></p>
		</div>
	</div>

	<div style="padding-top: 100%">&nbsp;</div>

	<div id="footer">
		<div class="container">
			<p class="text-muted">Place sticky footer content here.</p>
		</div>
	</div>

	<script src="public/js/jquery-1.10.2.min.js"></script>
	<script src="public/js/bootstrap.min.js"></script>
</body>
</html>